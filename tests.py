from unittest import TestCase
from app import app
from models import db, Cupcake

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_test'
app.config['SQLALCHEMY_ECHO'] = False

app.config['TESTING'] = True

db.drop_all()
db.create_all()

CUPCAKE_DATA = {
  "flavor": "TestFlavor",
  "size": "TestSize",
  "rating": 5.0,
  "image": "http://test.com/cupcake.jpg"
}

CUPCAKE_DATA_2 = {
  "flavor": "TestFlavor2",
  "size": "TestSize2",
  "rating": 10.0,
  "image": "http://test.com/cupcake2.jpg"
}

class CupcakeViewsTestCase(TestCase):
  """API Testing Routes"""
  def setUp(self):
    """Test clean up"""
    with app.app_context():
      Cupcake.query.delete()

      cupcake = Cupcake(**CUPCAKE_DATA)
      db.session.add(cupcake)
      db.session.commit()
      self.cupcake = cupcake

  def tearDown(self):
    with app.app_context():
      db.session.rollback()

  def test_list_cupcakes(self):
    """Tests GET ALL cupcakes"""
    with app.test_client() as client:
      res = client.get("/api/cupcakes")
      self.assertEqual(res.status_code, 200)

      data = res.json
      self.assertEqual(data, {
        "cupcakes": [
          {
            "id": self.cupcake.id,
            "flavor": "TestFlavor",
            "size": "TestSize",
            "rating": 5.0,
            "image": "http://test.com/cupcake.jpg"
          }
        ]
      })

  def test_get_cupcake(self):
    """Tests GET single cupcake"""
    with app.test_client() as client:
      url = f"/api/cupcakes/{self.cupcake.id}"
      res = client.get(url)
      self.assertEqual(res.status_code, 200)

      data = res.json
      self.assertEqual(data, {
        "cupcake": {
          "id": self.cupcake.id,
          "flavor": "TestFlavor",
          "size": "TestSize",
          "rating": 5.0,
          "image": "http://test.com/cupcake.jpg"
        }
      })

  def test_create_cupcake(self):
    """Tests POST to create a cupcake"""
    with app.test_client() as client:
      url = "/api/cupcakes"
      res = client.post(url, json=CUPCAKE_DATA_2)
      self.assertEqual(res.status_code, 201)

      data = res.json
      self.assertIsInstance(data['cupcake']['id'], int)
      del data['cupcake']['id']

      self.assertEqual(data, {
        "cupcake": {
          "flavor": "TestFlavor2",
          "size": "TestSize2",
          "rating": 10.0,
          "image": "http://test.com/cupcake2.jpg"
        }
      })

      self.assertEqual(Cupcake.query.count(), 2)

  def test_patch(self):
    """Tests PATCH route to update cupcake"""
    with app.test_client() as client:
      url = f"/api/cupcakes/{self.cupcake.id}"
      res = client.patch(url, json={
        "flavor": "Vanilla",
        "size": "Medium",
        "rating": 5.0,
        "image": "http://example.com/vanilla.jpg"
      })

      self.assertEqual(res.status_code, 200)

      data = res.json
      self.assertEqual(data, {
        "cupcake": {
          "id": self.cupcake.id,
          "flavor": "Vanilla",
          "size": 5.0,
          "image": "http://example.com/vanilla.jpg"
        }
      })

  def test_delete_cupcake(self):
    """Tests DELETE cupcake"""
    with app.test_client as client:
      url = f"/api/cupcakes/{self.cupcake.id}"
      res = client.delete(url)

      self.assertEqual(res.status_code, 200)

      data = res.json
      self.assertEqual(data, {"message": "Deleted cupcake"})
      self.assertEqual(Cupcake.query.count(), 0)
