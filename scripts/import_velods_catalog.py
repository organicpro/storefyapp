import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import openpyxl


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK_PATH = ROOT.parent / "velods_catalogo_importacao.xlsx"
OUTPUT_PATH = ROOT / "src" / "data" / "velodsPhysicalProducts.ts"
REPORT_PATH = ROOT / "velods-import-report.json"
PUBLIC_IMAGE_ROOT = "/velods/"


def text(value):
    if value is None:
        return ""
    return str(value).strip()


def number(value, fallback=0):
    if value is None or value == "":
        return fallback
    if isinstance(value, (int, float)):
        return value
    raw = str(value).strip()
    try:
        if "," in raw:
            raw = raw.replace(".", "").replace(",", ".")
        return float(raw)
    except ValueError:
        return fallback


def slug(value):
    normalized = unicodedata.normalize("NFD", text(value))
    without_marks = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    clean = re.sub(r"[^a-zA-Z0-9]+", "-", without_marks).strip("-").lower()
    return clean[:80]


def normalize_local_path(value):
    clean = text(value).replace("\\", "/").lstrip("/")
    return f"{PUBLIC_IMAGE_ROOT}{clean}" if clean else ""


def category_from(row):
    category = text(row.get("category"))
    if category:
        return category
    title = f"{text(row.get('title'))} {text(row.get('description_text'))}".lower()
    if re.search(r"fone|audio|bluetooth|caixa|som|headset|earphone", title):
        return "Audio e Gadgets"
    if re.search(r"cabo|carregador|usb|suporte|adaptador|power bank|celular", title):
        return "Eletronicos e Acessorios"
    if re.search(r"cozinha|casa|organizador|limpeza|banheiro|utilidade", title):
        return "Casa e Utilidades"
    if re.search(r"brinquedo|kids|infantil|colecion", title):
        return "Brinquedos e Colecionaveis"
    if re.search(r"maquiagem|beleza|unha|pele|cabelo", title):
        return "Beleza e Cuidados"
    if re.search(r"roupa|bolsa|relogio|oculos|fitness|moda", title):
        return "Moda e Acessorios"
    return "Achados Velo"


def rows_from_sheet(workbook, sheet_name):
    sheet = workbook[sheet_name]
    rows = sheet.iter_rows(values_only=True)
    headers = [text(value) for value in next(rows)]
    return [dict(zip(headers, row)) for row in rows]


if not WORKBOOK_PATH.exists():
    raise FileNotFoundError(f"Planilha nao encontrada: {WORKBOOK_PATH}")

workbook = openpyxl.load_workbook(WORKBOOK_PATH, read_only=True, data_only=True)
product_rows = rows_from_sheet(workbook, "Produtos")
variant_rows = rows_from_sheet(workbook, "Variantes")
image_rows = rows_from_sheet(workbook, "Imagens")

variants_by_product = {}
for row in variant_rows:
    product_id = text(row.get("product_id"))
    if not product_id:
        continue
    variants_by_product.setdefault(product_id, []).append(
        {
            "productId": product_id,
            "externalId": text(row.get("external_id")),
            "title": text(row.get("title")),
            "name": text(row.get("variant_name")),
            "value": text(row.get("variant_value")),
            "sku": text(row.get("sku")),
            "stock": number(row.get("variant_stock")),
            "costPrice": number(row.get("variant_cost_price")),
        }
    )

images_by_product = {}
for row in image_rows:
    product_id = text(row.get("product_id"))
    if not product_id:
        continue
    images_by_product.setdefault(product_id, []).append(
        {
            "productId": product_id,
            "externalId": text(row.get("external_id")),
            "imageNumber": number(row.get("image_number")),
            "localPath": text(row.get("local_path")),
            "imageUrl": normalize_local_path(row.get("local_path")),
            "sourceUrl": text(row.get("source_url")),
            "downloadStatus": text(row.get("download_status")),
            "fileSizeBytes": number(row.get("file_size_bytes")),
        }
    )

for image_list in images_by_product.values():
    image_list.sort(key=lambda image: image["imageNumber"])

seen_external_ids = set()
duplicate_external_ids = []
products = []

for row in product_rows:
    product_id = text(row.get("product_id"))
    external_id = text(row.get("external_id"))
    if not product_id or not external_id:
        continue
    if external_id in seen_external_ids:
        duplicate_external_ids.append(external_id)
        continue
    seen_external_ids.add(external_id)

    images = images_by_product.get(product_id, [])
    variants = variants_by_product.get(product_id, [])
    title = text(row.get("title")) or f"Produto Velo {external_id}"
    cost_price = number(row.get("cost_price"))
    sale_price = number(row.get("suggested_price"), number(row.get("original_price"), cost_price))
    stock = number(row.get("stock_quantity"))
    rating = number(row.get("rating"))
    orders = number(row.get("orders_count"))
    brand = text(row.get("brand"))
    sku = text(row.get("sku"))

    benefits = [
        f"Estoque: {int(stock) if float(stock).is_integer() else stock}",
        f"Avaliacao: {rating:.1f}" if rating else "",
        f"{int(orders) if float(orders).is_integer() else orders} vendas registradas" if orders else "",
        f"Marca: {brand}" if brand else "",
        f"{len(variants)} variantes" if variants else "",
    ]

    source_url = text(row.get("product_url"))
    usable_images = [image for image in images if image["downloadStatus"].lower() == "ok" and image["fileSizeBytes"]]

    products.append(
        {
            "id": f"velo-{external_id or product_id}-{slug(title) or product_id}",
            "productId": product_id,
            "externalId": external_id,
            "name": title,
            "category": "Achados Fisicos",
            "subcategory": category_from(row),
            "supplier": text(row.get("supplier_name")) or "Velo",
            "brand": brand,
            "model": text(row.get("model")),
            "sku": sku,
            "source": text(row.get("source")),
            "costPrice": cost_price,
            "salePrice": sale_price,
            "originalPrice": number(row.get("original_price")),
            "marginPercent": number(row.get("margin_percent")),
            "stockQuantity": stock,
            "weightKg": number(row.get("weight_kg")),
            "rating": rating,
            "ordersCount": orders,
            "reviewsCount": number(row.get("reviews_count")),
            "imageUrl": usable_images[0]["imageUrl"] if usable_images else "",
            "images": images,
            "variants": variants,
            "descriptionHtml": text(row.get("description_html")),
            "descriptionText": text(row.get("description_text")),
            "benefits": [benefit for benefit in benefits if benefit],
            "deliverable": f"Fornecedor Velo - SKU {sku or external_id}",
            "addedToStore": False,
            "sourceUrl": source_url,
            "productUrl": source_url,
            "detailUrl": text(row.get("detail_url")),
            "importUrl": text(row.get("import_url")),
            "allLocalImages": text(row.get("all_local_images")),
        }
    )

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH.write_text(
    "import { Product } from '../types';\n\n"
    f"export const VELODS_PHYSICAL_PRODUCTS: Product[] = {json.dumps(products, ensure_ascii=False, indent=2)};\n",
    encoding="utf-8",
)

failed_original_image_downloads = [
    {
        "productId": text(row.get("product_id")),
        "externalId": text(row.get("external_id")),
        "imageNumber": number(row.get("image_number")),
        "sourceUrl": text(row.get("source_url")),
        "localPath": text(row.get("local_path")),
        "status": text(row.get("download_status")),
    }
    for row in image_rows
    if text(row.get("download_status")) and text(row.get("download_status")).lower() != "ok"
]

report = {
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "workbook": str(WORKBOOK_PATH),
    "products": len(products),
    "variants": len(variant_rows),
    "images": len(image_rows),
    "productsWithImages": len([product for product in products if product["images"]]),
    "productsWithoutImages": [
        {"productId": product["productId"], "externalId": product["externalId"], "title": product["name"]}
        for product in products
        if not product["images"]
    ],
    "duplicateExternalIds": duplicate_external_ids,
    "missingVariantLinks": len([row for row in variant_rows if text(row.get("external_id")) not in seen_external_ids]),
    "missingImageLinks": len([row for row in image_rows if text(row.get("external_id")) not in seen_external_ids]),
    "failedOriginalImageDownloads": failed_original_image_downloads,
}

REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
