import logging
from typing import Optional

from proofhire.backend.app.storage.base import BaseStorage

logger = logging.getLogger(__name__)


class ObjectStorage(BaseStorage):
    def __init__(self, bucket: str, endpoint_url: Optional[str] = None, access_key: Optional[str] = None, secret_key: Optional[str] = None):
        self.bucket = bucket
        self.endpoint_url = endpoint_url
        self.access_key = access_key
        self.secret_key = secret_key
        self._client = None

    async def _get_client(self):
        if self._client is None:
            try:
                import boto3
                self._client = boto3.client(
                    "s3",
                    endpoint_url=self.endpoint_url,
                    aws_access_key_id=self.access_key,
                    aws_secret_access_key=self.secret_key,
                )
            except ImportError:
                raise RuntimeError("boto3 is required for object storage")
        return self._client

    async def write(self, path: str, data: bytes, content_type: Optional[str] = None) -> str:
        client = await self._get_client()
        kwargs: dict = {"Bucket": self.bucket, "Key": path, "Body": data}
        if content_type:
            kwargs["ContentType"] = content_type
        client.put_object(**kwargs)
        return path

    async def read(self, path: str) -> bytes:
        client = await self._get_client()
        response = client.get_object(Bucket=self.bucket, Key=path)
        return response["Body"].read()

    async def delete(self, path: str) -> None:
        client = await self._get_client()
        client.delete_object(Bucket=self.bucket, Key=path)

    async def exists(self, path: str) -> bool:
        client = await self._get_client()
        try:
            client.head_object(Bucket=self.bucket, Key=path)
            return True
        except client.exceptions.NoSuchKey:
            return False
        except Exception:
            logger.exception("Object existence check failed for %s", path)
            return False

    async def signed_url(self, path: str, expires_in: int = 3600) -> str:
        client = await self._get_client()
        return client.generate_presigned_url("get_object", Params={"Bucket": self.bucket, "Key": path}, ExpiresIn=expires_in)
