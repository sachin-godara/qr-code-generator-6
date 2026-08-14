from starlette.requests import Request
from slowapi import Limiter

def get_client_ip(request: Request) -> str:
    """
    Safely resolves client IP for rate limiting behind reverse proxies
    (Cloudflare, Render, Nginx, AWS ALB).
    """
    # 1. Cloudflare Connecting IP
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()

    # 2. X-Real-IP (standard Nginx / reverse proxy header)
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    # 3. X-Forwarded-For (take the client IP in list)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ips = [ip.strip() for ip in forwarded_for.split(",") if ip.strip()]
        if ips:
            return ips[0]

    # 4. Fallback to direct client host
    if request.client and request.client.host:
        return request.client.host
        
    return "127.0.0.1"

limiter = Limiter(key_func=get_client_ip)
