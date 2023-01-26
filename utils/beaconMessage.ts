export const showBeaconMessage = (
  { subject, text }: { subject: string; text?: string },
  messageId: string
) => {
  // return
  window["Beacon"]("config", {
    docsEnabled: false,
  });
  window["Beacon"]("show-message", messageId, { force: true });

  window["Beacon"]("once", "message-triggered", () => {
    window["Beacon"]("prefill", {
      subject: subject,
      text: text,
    });
  });
};
