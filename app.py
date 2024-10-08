from flask import Flask, jsonify,request, render_template,redirect, url_for
from forms import CupcakeForm
from models import db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'cupcakes123'

db.init_app(app)

# Templates
@app.route('/')
def index():
  cupcakes = Cupcake.query.all()
  return render_template('index.html', cupcakes=cupcakes)

# API ROUTES
# Create a new cupcake (using WTForms)
@app.route('/cupcakes/new', methods=['GET', 'POST'])
def new_cupcake_form():
    form = CupcakeForm()
    if form.validate_on_submit():
        # Create a new cupcake from the form data
        new_cupcake = Cupcake(
            flavor=form.flavor.data,
            size=form.size.data,
            rating=form.rating.data,
            image=form.image.data or 'https://tinyurl.com/demo-cupcake'
        )
        db.session.add(new_cupcake)
        db.session.commit()
        return redirect(url_for('index'))  # Redirect to the cupcake list

    return render_template('add_cupcake.html', form=form)


# Update an existing cupcake (using WTForms)
@app.route('/cupcakes/update/<int:cupcake_id>', methods=['GET', 'POST'])
def update_cupcake_form(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    form = CupcakeForm(obj=cupcake)  # Pre-fill the form with current cupcake data

    if form.validate_on_submit():
        # Update cupcake with form data
        cupcake.flavor = form.flavor.data
        cupcake.size = form.size.data
        cupcake.rating = form.rating.data
        cupcake.image = form.image.data or 'https://tinyurl.com/demo-cupcake'

        db.session.commit()
        return redirect(url_for('index'))  # Redirect to the list of cupcakes after updating

    return render_template('update_cupcake.html', form=form, cupcake=cupcake)


# Delete a cupcake (using a POST form)
@app.route('/cupcakes/delete/<int:cupcake_id>', methods=['POST'])
def delete_cupcake_form(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    db.session.delete(cupcake)
    db.session.commit()
    return redirect(url_for('index'))  # Redirect to the list of cupcakes after deleting


# API: Get all cupcakes (for API interactions)
@app.route('/api/cupcakes', methods=['GET'])
def get_all_cupcakes():
    cupcakes = Cupcake.query.all()
    serialized = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=serialized)


# API: Update a cupcake (PATCH method for API)
@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    data = request.json

    cupcake.flavor = data['flavor']
    cupcake.size = data['size']
    cupcake.rating = data['rating']
    cupcake.image = data['image']

    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())


# API: Delete a cupcake (DELETE method for API)
@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="Deleted cupcake")


if __name__ == '__main__':
    app.run(debug=True)