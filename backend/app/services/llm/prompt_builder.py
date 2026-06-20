def build_prompt(question, contexts):

    context = "\n\n".join(contexts)

    return f"""
You are a helpful assistant.

Answer ONLY from the provided context.

If the answer is not contained in the context, say:

"I don't have enough information to answer that."

Context:
{context}

Question:
{question}

Answer:
"""