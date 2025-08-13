from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

ADMIN_USERS = {
    'admin': {
        'password_hash': generate_password_hash('admin'), 
        'role': 'super_admin'
    }
}

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return jsonify({'error': 'Admin auth required'}), 401
        
        if not session.get('admin_user'):
            return jsonify({'error': 'Invalid admin session'}), 401
            
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/check-session', methods=['GET'])
def admin_check_session():
    if session.get('admin_logged_in'):
        return jsonify({
            'logged_in': True,
            'user': session.get('admin_user'),
            'role': session.get('admin_role')
        }), 200
    else:
        return jsonify({
            'logged_in': False
        }), 200
    
@admin_bp.route('/dashboard', methods=['GET'])
@admin_required 
def admin_dashboard():
    try:
        admin_user = session.get('admin_user')
        admin_role = session.get('admin_role')
        
        dashboard_data = {
            'message': f'Welcome to admin dashboard, {admin_user}!',
            'role': admin_role,
            'server_status': 'online',
            'stats': {
                'total_memory_pairs': 0, 
                'admin_user': admin_user
            }
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400

        if username in ADMIN_USERS:
            stored_hash = ADMIN_USERS[username]['password_hash']
            
            if check_password_hash(stored_hash, password):
                session['admin_user'] = username
                session['admin_role'] = ADMIN_USERS[username]['role']
                session['admin_logged_in'] = True
                
                return jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'user': username,
                    'role': ADMIN_USERS[username]['role']
                }), 200
            else:
                return jsonify({'error': 'Invalid credentials'}), 401
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/logout', methods=['POST'])
def admin_logout():
    try:
        session.pop('admin_user', None)
        session.pop('admin_role', None)
        session.pop('admin_logged_in', None)
        
        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/change-password', methods=['POST'])
@admin_required
def admin_change_password():
    try:
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current password and new password required'}), 400
        
        admin_user = session.get('admin_user')
        
        if check_password_hash(ADMIN_USERS[admin_user]['password_hash'], current_password):
            ADMIN_USERS[admin_user]['password_hash'] = generate_password_hash(new_password)
            
            return jsonify({
                'success': True,
                'message': 'Password changed successfully'
            }), 200
        else:
            return jsonify({'error': 'Current password is incorrect'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route('/users', methods=['GET'])
@admin_required
def admin_list_users():
    try:
        current_user = session.get('admin_user')
        user_list = []
        
        for username, user_data in ADMIN_USERS.items():
            user_list.append({
                'username': username,
                'role': user_data.get('role', 'admin'),
                'created_by': 'system',
                'created_at': 'unknown',
                'is_current_user': username == current_user
            })
        
        return jsonify({
            'total_users': len(user_list),
            'users': user_list,
            'current_user': {'username': current_user, 'role': session.get('admin_role')}
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/create', methods=['POST'])
@admin_required
def admin_create_user():
    try:
        if session.get('admin_role') != 'super_admin':
            return jsonify({'error': 'Only super admins can create new users'}), 403
        
        data = request.get_json()
        new_username = data.get('username')
        new_password = data.get('password')
        new_role = data.get('role', 'admin')
    
        if not new_username or not new_password:
            return jsonify({'error': 'Username and password required'}), 400
        
        if new_username in ADMIN_USERS:
            return jsonify({'error': 'Username already exists'}), 400
        
        ADMIN_USERS[new_username] = {
            'password_hash': generate_password_hash(new_password),
            'role': new_role,
            'created_by': session.get('admin_user')
        }
        
        return jsonify({
            'success': True,
            'message': f'Admin user "{new_username}" created'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500