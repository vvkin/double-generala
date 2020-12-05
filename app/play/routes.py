from app.play import play
from flask import render_template, url_for, request, session, redirect

@play.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        name = request.form.get('name')
        session['name'] = name
        return redirect(url_for('play.play_game'))
    return render_template('home.html')

@play.route('/play')
def play_game():
    name = session.get('name')
    if name is not None:
        return render_template('play.html', name=name)
    return redirect(url_for('play.home'))
