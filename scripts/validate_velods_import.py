import json
from pathlib import Path

import openpyxl


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK_PATH = ROOT.parent / "velods_catalogo_importacao.xlsx"
IMAGE_ROOT = ROOT / "public" / "velods"


def text(value):
    if value is None:
        return ""
    return str(value).strip()


def rows_from_sheet(workbook, sheet_name):
    sheet = workbook[sheet_name]
    rows = sheet.iter_rows(values_only=True)
    headers = [text(value) for value in next(rows)]
    return [dict(zip(headers, row)) for row in rows]


workbook = openpyxl.load_workbook(WORKBOOK_PATH, read_only=True, data_only=True)
products = rows_from_sheet(workbook, "Produtos")
variants = rows_from_sheet(workbook, "Variantes")
images = rows_from_sheet(workbook, "Imagens")

product_ids = {text(row.get("product_id")) for row in products}
external_ids = {text(row.get("external_id")) for row in products}
variant_bad_links = [
    row for row in variants
    if text(row.get("product_id")) not in product_ids or text(row.get("external_id")) not in external_ids
]
image_bad_links = [
    row for row in images
    if text(row.get("product_id")) not in product_ids or text(row.get("external_id")) not in external_ids
]

missing_files = []
for row in images:
    local_path = text(row.get("local_path")).replace("\\", "/").lstrip("/")
    if local_path and not (IMAGE_ROOT / local_path).exists():
        missing_files.append(
            {
                "productId": text(row.get("product_id")),
                "externalId": text(row.get("external_id")),
                "imageNumber": row.get("image_number"),
                "sourceUrl": text(row.get("source_url")),
                "localPath": local_path,
                "status": text(row.get("download_status")),
            }
        )

result = {
    "products": len(products),
    "uniqueProducts": len(product_ids),
    "uniqueExternalIds": len(external_ids),
    "variants": len(variants),
    "variantBadLinks": len(variant_bad_links),
    "images": len(images),
    "uniqueImagePaths": len({text(row.get("local_path")) for row in images if text(row.get("local_path"))}),
    "filesOnDisk": len([path for path in (IMAGE_ROOT / "images").glob("*") if path.is_file()]),
    "imageBadLinks": len(image_bad_links),
    "missingLocalFiles": len(missing_files),
    "missingLocalFileDetails": missing_files,
}

print(json.dumps(result, ensure_ascii=False, indent=2))
