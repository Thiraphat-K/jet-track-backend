export default () => ({
  address: process.env.JT_BACKEND,
  port: parseInt(process.env.PORT!, 10),
  'access-signup': process.env.ACCESS_SIGNUP,
  secret: process.env.SECRET,
  'jwt-secret': process.env.JWT_SECRET,
  'access-delete': process.env.ACCESS_DELETE,
  'minio-api': process.env.JT_MINIO_API,
  'minio-endpoint': process.env.S3_ENDPOINT,
  'minio-api-port': process.env.S3_PORT,
  'minio-access_key': process.env.S3_ACCESS_KEY,
  'minio-secret_key': process.env.S3_SECRET_KEY,
  'minio-bucket': process.env.S3_BUCKET_NAME,
});
