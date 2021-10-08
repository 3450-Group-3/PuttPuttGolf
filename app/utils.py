def to_camel(string: str, upper_camel_case=False):
    """Converts the provided string to camelCase"""
    return "".join(
        [
            word.capitalize() if idx != 0 or upper_camel_case else word
            for idx, word in enumerate(string.split("_"))
        ]
    )