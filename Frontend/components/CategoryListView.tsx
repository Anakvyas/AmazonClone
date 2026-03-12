"use client";

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategoryListView = ({
  categories,
  selectedCategory,
  onSelect,
}: Props) => {
  return (
    <select
      aria-label="Select category"
      value={selectedCategory}
      onChange={(event) => onSelect(event.target.value)}
      className="h-full rounded-l-md border-r-2 border-transparent bg-[#f3f3f3] px-3 text-sm text-black/80 outline-none hover:border-amazonOrangeDark"
    >
      <option value="all">All</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryListView;
