# C:\Users\Melody\Documents\haliberrycake\backend\app\models\__init__.py
# Re-export all models so Alembic can discover them via this package
from .product     import Product
from .cake_class  import CakeClass
from .testimonial import Testimonial
from .gallery     import GalleryImage
from .inquiry     import Inquiry
from .cic         import CICProgram
from .user        import User

__all__ = [
    "Product", "CakeClass", "Testimonial",
    "GalleryImage", "Inquiry", "CICProgram", "User",
]