INSTALL? this worked on tiny macbook
python3.10 -m pip install -r requirements.txt

RUN LOCALLY
gunicorn app:app -c gunicorn.conf.py

DEPLOY
gcloud app deploy
