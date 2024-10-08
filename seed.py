from app import app
from models import db, Cupcake

with app.app_context():
  db.drop_all()
  db.create_all()

  cupcake1 = Cupcake(flavor="Vanilla", size="Medium", rating=8.5)
  cupcake2 = Cupcake(flavor="Chocolate", size="Large", rating=9.0, image="https://example.com/chocolate-cupcake.jpg")


  db.session.add_all([cupcake1, cupcake2])
  db.session.commit()