#gunakan imag nod js versi 18
FROM node:18-alpine

#set working directory dialam container
WORKDIR /app

#copy file package.json ke working directory
COPY package.json . /app/

#install dependencies
RUN npm install

#copy semua file ke container
COPY . . 

#expose port 3000
EXPOSE 3000

#jalankan aplikasi
CMD ["npm", "start"]