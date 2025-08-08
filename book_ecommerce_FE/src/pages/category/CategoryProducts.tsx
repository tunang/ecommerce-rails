import { useParams } from "react-router-dom";

const CategoryProducts = () => {
    const { id } = useParams();
  return (
    <div>Category: {id}</div>
  )
}

export default CategoryProducts