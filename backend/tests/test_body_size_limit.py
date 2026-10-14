from main import MAX_BODY_SIZE

def test_max_body_size_is_10mb():
    assert MAX_BODY_SIZE == 10 * 1024 * 1024, f"MAX_BODY_SIZE should be 10MB, but is {MAX_BODY_SIZE}"
