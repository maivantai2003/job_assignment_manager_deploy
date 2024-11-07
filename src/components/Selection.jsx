
const mapColor = new Map()
mapColor.set("unset", "text-gray-500")
mapColor.set("low", "text-blue-500")
mapColor.set("medium", "text-amber-600")
mapColor.set("high", "text-red-500")

export default function (props) {
  const { items, selectedItem, setSelectedItem } = props;
  const handleChange = (e) => {
    setSelectedItem(e.target.value);
  };
  return (
    <select
      id="priority"
      value={selectedItem || "unset"}
      onChange={handleChange} 
      className = {`rounded-full px-2 py-1 outline-none bg-transparent border-none font-bold ${mapColor?.get(selectedItem)}`}
    >
      <option className="bg-white text-black" value="unset">Unset</option>
      {items.map((priority,index) => {
        return <option className="bg-white text-black" value={priority.id} key={index}>{priority.name}</option>;
      })}
    </select>
  );
}
