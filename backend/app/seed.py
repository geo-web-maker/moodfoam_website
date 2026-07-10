"""
Populates the database with the categories and products that existed on the
old moodfoammattresses.com site (text content only -- no product images are
seeded, since none were available in the source snapshot; upload real photos
for each product from the admin dashboard after seeding).

Run with:  python -m app.seed
"""
import asyncio

from .database import init_db
from . import models

MATTRESS_SIZES = [
    "6 x 2.5 x 2", "6 x 2.5 x 3", "6 x 2.5 x 4", "6 x 3 x 3", "6 x 3 x 4",
    "6 x 3 x 6", "6 x 3.5 x 6", "6 x 4 x 4", "6 x 4 x 6", "6 x 4.5 x 6",
    "6 x 5 x 6", "6 x 6 x 6", "6 x 3.5 x 8", "6 x 4 x 8", "6 x 4.5 x 8",
    "6 x 5 x 8", "6 x 6 x 8", "6 x 4 x 10", "6 x 4.5 x 10", "6 x 5 x 10",
    "6 x 6 x 10", "6 x 4 x 12", "6 x 4.5 x 12", "6 x 5 x 12", "6 x 6 x 12",
]

CATEGORIES = [
    {
        "slug": "spring-mattresses",
        "name": "Spring Mattresses",
        "description": "Experience balanced comfort and lasting support with our premium spring mattresses, designed to promote restful sleep night after night.",
        "sort_order": 1,
        "products": [
            {
                "slug": "spring-mattress",
                "name": "Spring Mattress",
                "short_description": "Balanced comfort and lasting support.",
                "description": "Experience balanced comfort and lasting support with our premium spring mattresses, designed to promote restful sleep night after night.",
                "sizes": MATTRESS_SIZES,
                "is_featured": True,
            }
        ],
    },
    {
        "slug": "orthopedic-mattresses",
        "name": "Orthopedic Mattresses",
        "description": "Engineered to align your spine and relieve pressure for superior comfort and support.",
        "sort_order": 2,
        "products": [
            {
                "slug": "orthopedic-mattress",
                "name": "Orthopedic Mattress",
                "short_description": "Spine alignment and pressure relief.",
                "description": "Sleep healthier with our orthopedic mattresses, engineered to align your spine and relieve pressure for superior comfort and support.",
                "sizes": MATTRESS_SIZES[:17],
                "is_featured": True,
            }
        ],
    },
    {
        "slug": "pvc-mattresses",
        "name": "PVC Mattresses",
        "description": "Medium duty standard mattresses with a quilted PVC/polyester fabric cover, ideal for homes, institutions and hospitality facilities.",
        "sort_order": 3,
        "products": [
            {
                "slug": "pvc-mattress",
                "name": "PVC Mattress",
                "short_description": "Durable, easy-clean cover for busy households.",
                "description": "These are medium duty standard mattresses with a quilted, easy-to-clean fabric cover available in various colours and designs -- suitable for homes, institutions and accommodation facilities such as hotels, motels and guest houses.",
                "sizes": [],
            }
        ],
    },
    {
        "slug": "deluxe-quilted-mattresses",
        "name": "Deluxe Quilted Mattresses",
        "description": "Soft cushioning and firm support for a premium sleep experience.",
        "sort_order": 4,
        "products": [
            {
                "slug": "deluxe-quilted-mattress",
                "name": "Deluxe Quilted Mattress",
                "short_description": "Plush, layered comfort with an elegant finish.",
                "description": "Indulge in luxury with deluxe mattresses combining soft cushioning and firm support for a premium sleep experience. Enjoy plush softness with our quilted mattresses, featuring layered cushioning for comfort and an elegant, textured finish.",
                "sizes": MATTRESS_SIZES,
                "is_featured": True,
            }
        ],
    },
    {
        "slug": "tape-edge-mattresses",
        "name": "Tape-Edge Mattresses",
        "description": "Reinforced edge-to-edge support that prevents sagging.",
        "sort_order": 5,
        "products": [
            {
                "slug": "tape-edge-mattress",
                "name": "Tape-Edge Mattress",
                "short_description": "Reinforced edges, durable support.",
                "description": "Reinforced tape-edge mattresses provide edge-to-edge support and prevent sagging, offering durability and superior comfort.",
                "sizes": MATTRESS_SIZES[:18],
            }
        ],
    },
    {
        "slug": "open-end-mattresses",
        "name": "Open-End Mattresses",
        "description": "Versatile, easy to handle, and perfect for flexible bed arrangements.",
        "sort_order": 6,
        "products": [
            {
                "slug": "open-end-mattress",
                "name": "Open-End Mattress",
                "short_description": "Versatile and easy to handle.",
                "description": "Our open-end mattresses are versatile, easy to handle, and perfect for flexible bed arrangements while maintaining comfort.",
                "sizes": MATTRESS_SIZES[:9],
            }
        ],
    },
    {
        "slug": "rebonded-mattresses",
        "name": "Rebonded Mattresses",
        "description": "High-density bonded foam for firm, long-lasting support.",
        "sort_order": 7,
        "products": [
            {
                "slug": "rebonded-mattress",
                "name": "Rebonded Mattress",
                "short_description": "High-density foam, firm support.",
                "description": "Durable rebonded mattresses with high-density bonded foam offer firm, long-lasting support for a comfortable and restorative sleep.",
                "sizes": MATTRESS_SIZES[:17],
            }
        ],
    },
    {
        "slug": "toppers",
        "name": "Toppers",
        "description": "An extra layer of cushioning to enhance any mattress.",
        "sort_order": 8,
        "products": [
            {
                "slug": "mattress-topper",
                "name": "Mattress Topper",
                "short_description": "Extra cushioning, superior comfort.",
                "description": "Enhance your mattress with luxurious toppers that provide an extra layer of cushioning and superior comfort.",
                "sizes": MATTRESS_SIZES,
            }
        ],
    },
    {
        "slug": "mattress-protectors",
        "name": "Mattress Protectors",
        "description": "Keep your mattress fresh and protected without giving up comfort.",
        "sort_order": 9,
        "products": [
            {
                "slug": "mattress-protector",
                "name": "Mattress Protector",
                "short_description": "Protective, comfortable cover.",
                "description": "Protect your mattress investment with our comfortable, breathable mattress protectors, fitted to a wide range of sizes.",
                "sizes": MATTRESS_SIZES,
            }
        ],
    },
    {
        "slug": "leather-covers",
        "name": "Leather Covers",
        "description": "Wipeable leather-look covers built for hospitality use.",
        "sort_order": 10,
        "products": [
            {
                "slug": "leather-cover",
                "name": "Leather Cover",
                "short_description": "Wipeable cover for high-traffic settings.",
                "description": "A durable, wipeable leather-look cover option available in various colours and designs -- suitable for homes, institutions and accommodation facilities such as hotels, motels and guest houses.",
                "sizes": [],
            }
        ],
    },
    {
        "slug": "beds",
        "name": "Beds",
        "description": "Ergonomic frames, premium upholstery, and contemporary styling for modern bedrooms.",
        "sort_order": 11,
        "products": [
            {
                "slug": "platform-bed",
                "name": "Platform Bed",
                "short_description": "Clean-lined, low-profile frame.",
                "description": "A low-profile platform bed frame with clean lines that suits contemporary bedrooms.",
            },
            {
                "slug": "canopy-bed",
                "name": "Canopy Bed",
                "short_description": "Statement four-poster styling.",
                "description": "A four-poster canopy bed frame that adds a striking, elegant centrepiece to any bedroom.",
            },
            {
                "slug": "shley-bed-6x6",
                "name": "Shley Bed 6x6",
                "short_description": "Upholstered headboard, 6x6 frame.",
                "description": "A padded, upholstered-headboard bed frame built to a standard 6x6 size.",
            },
            {
                "slug": "upholstered-bed",
                "name": "Upholstered Bed",
                "short_description": "Fully upholstered frame and headboard.",
                "description": "A fully upholstered bed frame with premium fabric finishing for a soft, hotel-style look.",
            },
        ],
    },
    {
        "slug": "sofas",
        "name": "Sofas",
        "description": "Ergonomic design, premium upholstery, and contemporary styling for modern living spaces.",
        "sort_order": 12,
        "products": [
            {
                "slug": "u-sofa",
                "name": "U-Shaped Sofa",
                "short_description": "Sectional seating for large living rooms.",
                "description": "A spacious U-shaped sectional sofa designed for family living rooms and lounges.",
            },
            {
                "slug": "l-sofa",
                "name": "L-Shaped Sofa",
                "short_description": "Corner sectional, space-efficient.",
                "description": "An L-shaped corner sofa that makes efficient use of room space without sacrificing comfort.",
            },
            {
                "slug": "modular-recliner",
                "name": "Modular Recliner",
                "short_description": "Reconfigurable reclining sections.",
                "description": "A modular recliner sofa with reconfigurable sections and reclining seats for maximum comfort.",
            },
            {
                "slug": "scandinavian-sofa",
                "name": "Scandinavian Sofa",
                "short_description": "Minimalist Scandinavian-inspired design.",
                "description": "A minimalist, Scandinavian-inspired sofa with clean lines and tapered wooden legs.",
            },
        ],
    },
    {
        "slug": "pillows",
        "name": "Pillows",
        "description": "Supportive and soft, our pillows cradle your head and neck for a restful night.",
        "sort_order": 13,
        "products": [
            {
                "slug": "deluxe-pillow",
                "name": "Deluxe Pillow",
                "short_description": "Premium fill, extra support.",
                "description": "A premium-fill pillow offering extra loft and support for side and back sleepers.",
            },
            {
                "slug": "ordinary-pillow",
                "name": "Ordinary Pillow",
                "short_description": "Everyday comfort, budget-friendly.",
                "description": "A soft, everyday pillow offering reliable comfort at an accessible price.",
            },
            {
                "slug": "quilted-deluxe-pillow",
                "name": "Quilted Deluxe Pillow",
                "short_description": "Quilted cover, plush fill.",
                "description": "A quilted-cover deluxe pillow that cradles the head and neck for a restful, rejuvenating sleep.",
            },
        ],
    },
    {
        "slug": "cushions-foam-sheets",
        "name": "Cushions & Foam Sheets",
        "description": "Cushions and slim foam sheets for furniture padding and custom comfort projects.",
        "sort_order": 14,
        "products": [
            {
                "slug": "orthopedic-foam-sheet",
                "name": "Orthopedic Foam Sheet",
                "short_description": "Firm support-grade foam sheet.",
                "description": "A firm, support-grade foam sheet suitable for orthopedic cushioning projects.",
            },
            {
                "slug": "standard-cushion",
                "name": "Standard Cushion",
                "short_description": "General-purpose seating cushion.",
                "description": "A general-purpose foam cushion for sofas, chairs, and window seats.",
            },
            {
                "slug": "high-density-cushion",
                "name": "High-Density Cushion",
                "short_description": "Extra-firm, long-lasting foam.",
                "description": "A high-density foam cushion built to hold its shape under heavy daily use.",
            },
            {
                "slug": "standard-foam-sheet",
                "name": "Standard Foam Sheet",
                "short_description": "Versatile foam sheet, cut to size.",
                "description": "A slim, versatile foam sheet designed for cushioning, furniture padding, and customisable comfort solutions.",
            },
        ],
    },
]


async def run():
    await init_db()

    if await models.Category.find_one({}):
        print("Database already has categories -- skipping seed. "
              "Drop the collections in Atlas first if you want to reseed from scratch.")
        return

    for cat_data in CATEGORIES:
        products = cat_data.pop("products")
        category = models.Category(**cat_data)
        await category.insert()

        for i, prod_data in enumerate(products):
            product = models.Product(
                category_id=str(category.id),
                sort_order=i,
                **prod_data,
            )
            await product.insert()

    print(f"Seeded {len(CATEGORIES)} categories.")


 if __name__ == "__main__":
    asyncio.run(run())
