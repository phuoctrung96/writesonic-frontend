export default function isUUID(id: string | string[]) {
  if (typeof id !== "string") {
    return false;
  }
  id = id.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (id === null) {
    return false;
  }
  return true;
}
