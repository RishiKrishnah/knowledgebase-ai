import pandas as pd


def load_excel(file_path: str):
    df = pd.read_excel(file_path)
    return df