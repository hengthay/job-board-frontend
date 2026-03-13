const formatOnlyDay = (dateString) => {
  if(!dateString) return "--";
  
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric"
  })
}

export default formatOnlyDay;