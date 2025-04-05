# Hoja
A food platform where only paying customers can leave reviews, ensuring authenticity.

This project builds a food ordering and payment platform where only users who have completed a payment can leave a review. This ensures that all restaurant scores reflect real experiences, preventing fake or biased comments from users who haven’t actually visited the restaurant. Birthday discount verified by Self protocol make it even cooler!

## Technologies
### Self Protocol Integration:
We integrated Self Protocol to verify users' birthday information. Using their SDK, users can authenticate their birthday and the data is securely verified with ZK-proof on-chain. The integration ensures privacy and accuracy of the user's personal data, as Self Protocol provides decentralized identity verification without exposing sensitive information.

### Blockchain Payments with Polygon and Celo:
Payments are processed on Polygon and Celo, two blockchain networks known for their low fees and fast transaction speeds. Users can select their preferred chain.

### Semaphore Group for Privacy:
After a successful payment, users are added to a Semaphore group, ensuring that reviews are both anonymous and secure. Semaphore provides cryptographic privacy by allowing users to generate and share ZK Proofs without disclosing their identity, enabling them to leave comments without compromising privacy.



The integration of ZK Proofs and Semaphore was particularly interesting. We used a combination of cryptographic primitives to ensure that users’ personal data was never exposed while still allowing them to participate in the review process. The entire process was built with decentralized identity in mind, ensuring privacy at every stage, from payment to review submission.

By using Self Protocol, Polygon, Celo, and Semaphore, we created a seamless and secure experience for users, especially those unfamiliar with cryptocurrencies, by abstracting away the complexities of blockchain interactions. This approach gives us a unique, privacy-preserving way to engage users while leveraging blockchain's advantages.