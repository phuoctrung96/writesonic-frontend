const rootCustomerLinks = (customerId: string | string[]) => {
  return `/dashboard/users/${customerId}/virtual`;
};

export default rootCustomerLinks;
