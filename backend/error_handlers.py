from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Not Found", "message": str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal Server Error", "message": str(error)}), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        return jsonify({
            "error": "Unexpected Error",
            "message": str(error),
            "type": error.__class__.__name__
        }), 500 