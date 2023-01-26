- Edit Copy button
  analytics.track('Copy Edited', {
  projectId,
  teamId,
  userId,
  templateName,
  historyId
  });

- Save Copy button
  analytics.track('Copy Saved', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Save Copy button
  analytics.track('Copy UnSaved', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Copy Copy button
  analytics.track('Copy Copied to Clipboard', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Delete Copy button
  analytics.track('Copy Deleted', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Download Copy button
  analytics.track('Copy Downloaded', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Rate Copy button
  analytics.track('Copy Rated', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- View History
  analytics.track('Copy History Viewed', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Regenerate button
  analytics.track('Copy Regenerated', {
  projectId,
  userId,
  teamId,
  templateName,
  historyId
  });

- Logout event
  analytics.track('User Logged Out', {
  userId,
  teamId,
  email
  });

- Sign Up event
  analytics.track("User Signed Up", {
  userId,
  name,
  teamId,
  email,
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Sign In event
  analytics.track("User Logged In", {
  userId,
  teamId,
  email
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Change profile information
  analytics.track("Profile Information Changed", {
  userId,
  teamId,
  email,
  firstName,
  lastName
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Change Email
  analytics.track("Email Changed", {
  userId,
  teamId,
  email,
  firstName,
  lastName
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Change default system language
  analytics.track('System Language Changed', {
  userId,
  teamId,
  oldLanguageId,
  newLanguageId
  });

- Change default generation language
  analytics.track('Generation Language Changed', {
  userId,
  teamId,
  oldLanguageId,
  newLanguageId
  });

- Invited Team Member
  analytics.track('Team Member Invited', {
  userId,
  teamId,
  teamMemberEmail,
  teamMemberRole
  });

- Deleted Team Member
  analytics.track('Team Member Removed', {
  userId,
  teamId,
  teamMemberId,
  teamMemberEmail,
  teamMemberRole
  });

- Deleted Pending Team Member
  analytics.track('Pending Team Member Removed', {
  userId,
  teamId,
  teamMemberEmail,
  teamMemberRole
  });
- Subscription Checkout Initiated
  analytics.track('Subscription Checkout Initiated ', {
  userId,
  teamId,
  stripePriceId,
  amount,
  credits,
  interval
  });

- Pay as you go Checkout Initiated
  analytics.track('Pay-as-you-Go Checkout Initiated ', {
  userId,
  teamId,
  stripePriceId,
  amount,
  credits,
  });

- Purchased Pay as you go
  analytics.track('Pay-as-you-Go Credits Purchased', {
  userId,
  teamId,
  stripePriceId,
  amount,
  credits
  });

- Subscribed to a plan
  analytics.track('Subscription Plan Purchased', {
  userId,
  teamId,
  stripePriceId,
  amount,
  credits,
  interval
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Changed plan
  analytics.track('Subscription Plan Changed', {
  userId,
  teamId,
  oldStripePriceId,
  oldAmount,
  oldCredits,
  oldInterval,
  newStripePriceId,
  newAmount,
  newCredits,
  newInterval,
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Cancelled plan
  analytics.track('Subscription Plan Cancelled', {
  userId,
  teamId,
  stripePriceId,
  amount,
  credits,
  interval
  });
  window["analytics"]?.identify(myId, {
  firstName: myFirstName,
  lastName: myLastName,
  email: myEmail,
  language: myLanguage,
  plan: planName
  });

- Set name for each individual page
- Earn Free Credits page title wrong
- Request a Feature page title wrong
