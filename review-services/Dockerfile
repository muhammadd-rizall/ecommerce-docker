FROM python:3.11-slim

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

#copy semua file ke dalam container
COPY . .

#exspo port
EXPOSE 5002

#jalankan aplikasi
CMD ["python", "app.py"]