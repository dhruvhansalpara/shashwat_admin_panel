# Security Specification for Shashwat Holiday Admin

## 1. Data Invariants
- **Packages**: Must have a name, numeric price, numeric days, description, and valid image URL.
- **Banners**: Must have a valid image URL. Optional title.
- **Inquiries**: Must have customer name, phone, and message.
- **Settings**: Only one document exists at `/settings/global`.
- **Administrative Access**: ONLY authenticated admins can write to packages, banners, and settings.
- **Public Access**: Public can read packages and banners. Public can ONLY create inquiries. Public cannot read inquiries.

## 2. The "Dirty Dozen" Payloads (Deny Expected)

1. **Identity Spoofing**: Attempt to create a package without being signed in.
2. **Resource Poisoning**: Document ID with 2KB junk characters.
3. **Ghost Field Update**: Updating a package with a field like `isVerified: true`.
4. **PII Leak**: Unauthorized user attempting to `list` or `get` inquiries.
5. **State Shortcut**: Attempting to update an inquiry's `createdAt` timestamp.
6. **Self-Assigned Admin**: User attempting to create a document in `/admins/` collection.
7. **Cross-Tenant Write**: (N/A for this simple app, but general rule applies).
8. **Malicious Image URL**: Injecting a script tag into the `image` field.
9. **Zero Price**: Creating a package with price 0 or negative.
10. **Query Scraping**: Authenticated user trying to list ALL inquiries without any filters (though for this app, even signed-in non-admins shouldn't see them).
11. **Settings Hijack**: Unauthorized user attempting to change the WhatsApp number.
12. **Banner Overgrowth**: Attempting to upload a banner with a 2MB title string.

## 3. Test Runner (Mock Logic)
The following rules will be tested to ensure these payloads are blocked.
