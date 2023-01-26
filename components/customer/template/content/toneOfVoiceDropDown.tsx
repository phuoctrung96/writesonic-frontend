import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TonOfVoice } from "../../../../api/list";
import DropDown from "../../dashboardContent/dropDown";

function ToneOfVoiceDropDown({
  tonOfVoices,
  value,
  onChange,
  disabled,
}: {
  tonOfVoices: TonOfVoice[];
  value?: string;
  onChange?: Function;
  disabled?: boolean;
}) {
  const [toneOfVoice, setTonOfVoice] = useState<TonOfVoice>();

  const handleChange = (toneOfVoice) => {
    onChange(toneOfVoice.value);
  };

  useEffect(() => {
    if (!tonOfVoices) {
      return;
    }
    setTonOfVoice(
      tonOfVoices.find(
        (item) => item.value.toLowerCase() === value?.toLowerCase()
      ) ?? tonOfVoices[0]
    );
  }, [tonOfVoices, value]);

  return (
    <DropDown
      label="Tone Of Voice"
      options={tonOfVoices}
      value={toneOfVoice}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

const mapStateToPros = (state) => {
  return {
    tonOfVoices: state?.options?.tonOfVoices,
  };
};

export default connect(mapStateToPros)(ToneOfVoiceDropDown);
