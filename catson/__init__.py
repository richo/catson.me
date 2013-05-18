from flask import Flask, render_template, request

def make_app():
    app = Flask(__name__)

    @app.route("/")
    def index():
        return render_template("index.html")

    return app
