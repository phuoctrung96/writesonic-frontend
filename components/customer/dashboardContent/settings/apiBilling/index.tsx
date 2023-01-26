import { connect } from "react-redux";
import { XSubscription } from "../../../../../api/credit_v2";
import PaymentMethod from "./paymentMethod";
import PreviousInvoices from "./previousInvoices";
import YourPlan from "./yourPlan";

const ApiBilling: React.FC<{
  businessId: string;
  subscription: XSubscription;
  x_stripe_customer_id: string;
}> = (props) => {
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <YourPlan {...props} />
      {props.subscription && props.subscription.x_default_card && (
        <div className="mt-3">
          <PaymentMethod {...props} />
        </div>
      )}
      {!!props.x_stripe_customer_id && <PreviousInvoices />}
      {/* <OneTimePurchase {...props} /> */}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    businessId: state.user?.business_id ?? "",
    subscription: state.user?.x_subscription,
    x_stripe_customer_id: state.user?.x_stripe_customer_id,
  };
};

export default connect(mapStateToPros)(ApiBilling);
