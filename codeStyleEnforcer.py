import ast
import re
import glob
import os

def log_change(file_path, line_number, description):
    with open("style_enforcement_report.txt", "a") as report:
        report.write(f"{file_path}, Line {line_number}: {description}\n")

class StyleEnforcer(ast.NodeTransformer):
    def __init__(self, lines, file_path):
        self.lines = lines
        self.file_path = file_path
        self.last_node_type = None

    def visit_ClassDef(self, node):
        original_name = node.name
        new_name = node.name.title().replace('_', '')
        if original_name != new_name:
            log_change(self.file_path, node.lineno, f"Class name changed from '{original_name}' to '{new_name}'")
        node.name = new_name
        self.ensure_blank_lines(node, 2)
        self.last_node_type = 'class'
        self.generic_visit(node)
        return node

    def visit_FunctionDef(self, node):
        original_name = node.name
        new_name = node.name.lower()
        if original_name != new_name:
            log_change(self.file_path, node.lineno, f"Function name changed from '{original_name}' to '{new_name}'")
        node.name = new_name
        blanks = 2 if self.last_node_type != 'class' else 1
        self.ensure_blank_lines(node, blanks)
        self.last_node_type = 'function'
        self.generic_visit(node)
        return node

    def visit_Assign(self, node):
        if len(node.targets) > 1:
            log_change(self.file_path, node.lineno, "Split compound variable assignment into separate lines")
            return [ast.Assign(targets=[target], value=node.value) for target in node.targets]
        return self.generic_visit(node)

    def ensure_blank_lines(self, node, num_lines):
        start_line = node.lineno - 1
        for i in range(num_lines):
            if start_line - i <= 0 or self.lines[start_line - i - 1].strip() != '':
                self.lines.insert(start_line - i, '\n')
                log_change(self.file_path, start_line - i, f"Inserted blank line(s) for {node.__class__.__name__}")

def enforce_style(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    for i, line in enumerate(lines):
        # Enforce imports on separate lines and correct whitespace
        lines[i] = re.sub(r'import\s+(.*)\s*,\s*(.*)', r'import \1\nimport \2', line)
        lines[i] = re.sub(r'\s*,\s*', ', ', lines[i])
        lines[i] = re.sub(r'\s*([(){}[\]])\s*', r'\1', lines[i])
        # Enforce line length
        if len(lines[i]) > 79:
            log_change(file_path, i + 1, "Truncated line exceeding 79 characters")
            lines[i] = lines[i][:76] + '...\n'

    tree = ast.parse(''.join(lines))
    enforcer = StyleEnforcer(lines, file_path)
    enforcer.visit(tree)

    new_file_path = file_path.replace('.py', '_style_enforced.py')
    with open(new_file_path, 'w') as new_file:
        new_file.writelines(lines)

def enforce_style_on_directory(directory_path):
    for file_path in glob.glob(os.path.join(directory_path, '*.py')):
        enforce_style(file_path)

# Replace 'path/to/directory' with the path to your directory
enforce_style_on_directory('path/to/directory')
