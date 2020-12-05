from app.play import play
from flask import render_template, url_for, request, session, redirect

@play.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        name = request.form.get('name')
        session['name'] = name
        return redirect(url_for('play.play_game'))
    return render_template('home.html')
