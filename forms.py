from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SubmitField
from wtforms.validators import InputRequired, NumberRange, URL, Optional

class CupcakeForm(FlaskForm):
  flavor = StringField('Flavor', validators=[InputRequired()])
  size = StringField('Size', validators=[InputRequired()])
  rating = FloatField('Rating', validators=[InputRequired(), NumberRange(min=0, max=10)])
  image = StringField('Image URL', validators=[Optional(), URL()])
  submit = SubmitField('Submit')