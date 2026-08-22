from pathlib import Path

TEMPLATE_DIR = Path(__file__).resolve().parent


def render_template(template_name: str, context: dict) -> str:
    template_path = TEMPLATE_DIR / template_name

    if not template_path.exists():
        raise FileNotFoundError(f"Report template not found: {template_path}")

    content = template_path.read_text(encoding="utf-8")

    for key, value in context.items():
        content = content.replace("{{ " + key + " }}", str(value))
        content = content.replace("{{" + key + "}}", str(value))

    return content
