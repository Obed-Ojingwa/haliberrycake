# # test_bcrypt.py
import bcrypt

# # from passlib.context import CryptContext

# # pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # print(pwd.hash("a"))


# 222222 


# import bcrypt

# pw = bcrypt.hashpw(b"test123", bcrypt.gensalt())
# print(pw)

# 333333

from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

print(pwd.hash("TestAdmin123!"))