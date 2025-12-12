import type { SupportMessage } from '$lib/types';

function iso(hoursAgo: number): string {
  const d = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return d.toISOString();
}

export const seedMessages: SupportMessage[] = [
  {
    id: 'm-001',
    customerEmail: 'alice@example.com',
    body: 'I was charged twice for my subscription this month. Can you refund one charge?',
    createdAt: iso(6),
    resolved: false
  },
  {
    id: 'm-002',
    customerEmail: 'bob@example.com',
    body: 'The app crashes when I try to export a report on Windows 11.',
    createdAt: iso(12),
    resolved: false
  },
  {
    id: 'm-003',
    customerEmail: 'carol@example.com',
    body: 'Can you add support for SSO with Okta for our enterprise plan?',
    createdAt: iso(20),
    resolved: false
  },
  {
    id: 'm-004',
    customerEmail: 'dan@example.com',
    body: 'I forgot my password and the reset link is not arriving.',
    createdAt: iso(3),
    resolved: false
  },
  {
    id: 'm-005',
    customerEmail: 'eve@example.com',
    body: 'Our invoice shows the wrong company address. How do we update billing info?',
    createdAt: iso(48),
    resolved: false
  },
  {
    id: 'm-006',
    customerEmail: 'frank@example.com',
    body: 'I found a bug: tags disappear after refreshing the page.',
    createdAt: iso(30),
    resolved: false
  },
  {
    id: 'm-007',
    customerEmail: 'grace@example.com',
    body: 'Please add a dark mode toggle. Our team prefers it for late shifts.',
    createdAt: iso(8),
    resolved: false
  },
  {
    id: 'm-008',
    customerEmail: 'heidi@example.com',
    body: 'Can you help me change the owner of our workspace?',
    createdAt: iso(15),
    resolved: false
  },
  {
    id: 'm-009',
    customerEmail: 'ivan@example.com',
    body: 'The CSV import keeps failing with a “parse error”.',
    createdAt: iso(2),
    resolved: false
  },
  {
    id: 'm-010',
    customerEmail: 'judy@example.com',
    body: 'I want to upgrade to the Pro plan but the payment is declined.',
    createdAt: iso(5),
    resolved: false
  },
  {
    id: 'm-011',
    customerEmail: 'kate@example.com',
    body: 'Where can I download past invoices for the last year?',
    createdAt: iso(26),
    resolved: false
  },
  {
    id: 'm-012',
    customerEmail: 'leo@example.com',
    body: 'When I invite teammates, they never receive the invite email.',
    createdAt: iso(9),
    resolved: false
  },
  {
    id: 'm-013',
    customerEmail: 'mallory@example.com',
    body: 'Feature request: webhooks when a ticket is resolved.',
    createdAt: iso(34),
    resolved: false
  },
  {
    id: 'm-014',
    customerEmail: 'nick@example.com',
    body: 'I cannot log in with Google anymore, it says “unauthorized”.',
    createdAt: iso(11),
    resolved: false
  },
  {
    id: 'm-015',
    customerEmail: 'olivia@example.com',
    body: 'Is there a way to set different roles and permissions per project?',
    createdAt: iso(17),
    resolved: false
  },
  {
    id: 'm-016',
    customerEmail: 'peggy@example.com',
    body: 'Our credit card expired, how do we update payment details?',
    createdAt: iso(22),
    resolved: false
  },
  {
    id: 'm-017',
    customerEmail: 'quentin@example.com',
    body: 'Mobile app is very slow on the latest iOS; any workaround?',
    createdAt: iso(7),
    resolved: false
  },
  {
    id: 'm-018',
    customerEmail: 'romeo@example.com',
    body: 'Getting 500 errors on the API when creating tickets.',
    createdAt: iso(13),
    resolved: false
  },
  {
    id: 'm-019',
    customerEmail: 'sybil@example.com',
    body: 'Can you merge two of our accounts into one organization?',
    createdAt: iso(40),
    resolved: false
  },
  {
    id: 'm-020',
    customerEmail: 'trent@example.com',
    body: 'I accidentally deleted a project. Is there a way to recover it?',
    createdAt: iso(28),
    resolved: false
  }
];

