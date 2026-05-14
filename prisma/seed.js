require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'george@example.com' },
    update: {},
    create: {
      email: 'george@example.com',
      passwordHash: hashedPassword,
      name: 'George',
    },
  })

  // Create Tours
  await prisma.tour.upsert({
    where: { slug: 'athens-sounio' },
    update: {},
    create: {
      slug: 'athens-sounio',
      title: 'Athens Highlights & Cape Sounio',
      category: 'DAY_TOUR',
      shortDesc: '8 hours Private Multi Stop Ride. See the best of Athens and a stunning sunset at Sounio.',
      description: `Start with “the Bird Eye View” from Lycabettus Hill, the highest lookout of Athens downtown. Visiting Athens??? 🧳✈️🇬🇷\n\nI made this itinerary for those Visitors who have only one or two days available in Athens and they don't want to miss anything. No deposit required, payment after service.\n\nThe following itinerary is an 8 hours Private Multi Stop Ride with my Taxi 🚖 (available for your group 1-4 persons).\n\nWe usually start at 08:30 but the itinerary can be fully customised according to your available time and according to the places that you would like to visit.`,
      highlights: JSON.stringify([
        "Pick up from your hotel, airport or cruise ship",
        "Lycabettus Hill (360° view) 20'",
        "Opera House & The Runner statue",
        "Ancient olive tree (1500yo)",
        "Prime Minister House & Palace",
        "Old Olympic Stadium 15'",
        "Parliament & changing of the guards 15'",
        "National Academy, University & Library",
        "Varvakios Agora 20'",
        "Plaka & Anafiotika",
        "Acropolis - Parthenon 10'",
        "Lake Vouliagmeni 10'",
        "Temple of Poseidon at Cape Sounio 30'-45'",
        "Free time for lunch at beach front restaurants"
      ]),
      duration: '8 hours',
      distance: '160km (100mi)',
      priceFrom: 260,
      included: JSON.stringify([
        "Pick up - Drop off",
        "Tolls",
        "Luggage",
        "Waiting time",
        "Tax",
        "Bottled water",
        "Free WiFi",
        "Liability insurance inside vehicle"
      ]),
      excluded: JSON.stringify([
        "Tickets at the Temple of Poseidon",
        "Lunch at local restaurants",
        "Licenced Tour guide (upon request)"
      ]),
      photos: {
        create: [
          { url: '/photos/4c8caf05-1ae7-48d4-9ced-287b6f63df53.jfif', sortOrder: 1 },
          { url: '/photos/7de10596-bd1c-42bf-9e88-a76f4cbc4389.jfif', sortOrder: 2 },
          { url: '/photos/006d52d0-ece0-476f-ae91-622db308a6d3.jfif', sortOrder: 3 },
        ]
      }
    },
  })

  await prisma.tour.upsert({
    where: { slug: 'corinth-mycenae-nafplion' },
    update: {},
    create: {
      slug: 'corinth-mycenae-nafplion',
      title: 'Corinth, Mycenae & Nafplion',
      category: 'DAY_TOUR',
      shortDesc: '10-12 hours Private Tour. Ancient history, Venetian charm, and coastal views.',
      description: `Ancient Corinth, Mycenae (1.700 BC) and Nafplion private tour from Athens is full of ancient Greek history, Venetian charm, scenic coastal views, and cultural insights.\n\nLasting roughly 10 -12 hours, these tours from Athens generally feature the engineering marvel of the Corinth Canal, the Temple of Apollo in Ancient Corinth and the picturesque, romantic, and historic city of Nafplion. No deposit required, payment after service.`,
      highlights: JSON.stringify([
        "Corinth Canal",
        "Diolkos",
        "Ancient Corinth",
        "Akrocorinth",
        "Mycenae",
        "Treasury of Atreus",
        "Palamidi Fortress",
        "Nafplion - free time for walk and lunch"
      ]),
      duration: '10-12 hours',
      priceFrom: 380,
      included: JSON.stringify([
        "Pick up / Drop off",
        "Roundtrip transportation by air-conditioned Taxi",
        "Stops for panoramic views and photos",
        "Free WIFI",
        "Bottled Water",
        "All Taxes",
        "Liability insurance"
      ]),
      excluded: JSON.stringify([
        "Entrance fees",
        "Lunch",
        "Licenced Tour Guide"
      ]),
      photos: {
        create: [
          { url: '/photos/0b55f0ee-dce1-4e33-a9b3-39e6f9e1dbee.jfif', sortOrder: 1 },
          { url: '/photos/6fd01cac-9d39-4a2a-b256-d6d9dce77acc.jfif', sortOrder: 2 },
          { url: '/photos/1ea2cb4d-feb7-4581-a516-b9dcdd423211.jfif', sortOrder: 3 },
          { url: '/photos/57972f52-f0e1-451d-8505-c330a99d73e6.jfif', sortOrder: 4 },
        ]
      }
    },
  })

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
