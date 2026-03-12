import { NavItem } from "@/components/type";

export const footerData = [
  {
    _id: "1",
    title: "Get to Know Us",
    listItem: [
      { listData: ["Careers", "Blog", "About Amazon", "Investor Relations"] },
    ],
  },
  {
    _id: "2",
    title: "Make Money with Us",
    listItem: [
      {
        listData: [
          "Sell products on Amazon",
          "Sell on Amazon Business",
          "Become an Affiliate",
          "Advertise Your Products",
        ],
      },
    ],
  },
  {
    _id: "3",
    title: "Amazon Payment Products",
    listItem: [
      { listData: ["Amazon Business Card", "Shop with Points", "Reload Your Balance"] },
    ],
  },
  {
    _id: "4",
    title: "Let Us Help You",
    listItem: [
      { listData: ["Amazon and COVID-19", "Your Account", "Your Orders", "Help"] },
    ],
  },
];

export const sidebarItems: NavItem[] = [
  {
    title: "Digital Content & Devices",
    items: ["Prime Video", "Amazon Music"],
    subItems: [
      ["All Prime Video", "Movies", "TV Shows"],
      ["Stream Music", "Open Web Player", "Podcasts"],
    ],
  },
  {
    title: "Shop By Department",
    items: ["Electronics", "Fashion"],
    subItems: [
      ["Mobiles", "Laptops", "Accessories"],
      ["Men", "Women", "Kids"],
    ],
  },
];