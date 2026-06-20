def row_to_document(row):

    text = (
        f"Question: {row['Question']}\n"
        f"Answer: {row['Answer']}"
    )

    return text