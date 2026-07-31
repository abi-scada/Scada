from pwdlib import PasswordHash

pass_hasher = PasswordHash.recommended()

def hash_password(pwd: str):
    return pass_hasher.hash(pwd)

def verify_password(pwd: str, h_pwd: str) -> bool:
    try:
        return pass_hasher.verify(pwd, h_pwd)
    except Exception as e:
        print("Error in hashing :",e)
        return False