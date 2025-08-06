# db/seeds.rb

puts "🌱 Seeding nested categories..."

Category.destroy_all

# Hàm đệ quy để tạo categories lồng nhau
def create_category_tree(data, parent = nil)
  data.each do |category_data|
    children = category_data.delete(:children)
    category = Category.create!(
      name: category_data[:name],
      description: category_data[:description],
      parent: parent,
      active: true
    )
    create_category_tree(children, category) if children.present?
  end
end

# Dữ liệu categories lồng nhau
nested_categories = [
  {
    name: "Sách",
    description: "Tổng hợp các loại sách",
    children: [
      {
        name: "Kinh doanh",
        description: "Sách về kinh doanh, tài chính",
        children: [
          { name: "Khởi nghiệp", description: "Khởi nghiệp, startup" },
          { name: "Tài chính cá nhân", description: "Quản lý tiền bạc cá nhân" }
        ]
      },
      {
        name: "Công nghệ",
        description: "Sách công nghệ, lập trình",
        children: [
          {
            name: "Lập trình",
            description: "Sách về code",
            children: [
              { name: "Web", description: "Lập trình web" },
              { name: "Mobile", description: "Lập trình mobile" }
            ]
          }
        ]
      },
      {
        name: "Văn học",
        description: "Sách văn học"
      },
      {
        name: "Thiếu nhi",
        description: "Sách dành cho trẻ em"
      }
    ]
  },
  {
    name: "Đời sống",
    description: "Các chủ đề về cuộc sống",
    children: [
      { name: "Ẩm thực", description: "Món ăn, dinh dưỡng" },
      {
        name: "Sức khỏe",
        description: "Thể chất và tinh thần",
        children: [
          { name: "Tâm lý học", description: "Hiểu về bản thân và người khác" }
        ]
      }
    ]
  }
]

# Seed dữ liệu
create_category_tree(nested_categories)

puts "✅ Nested categories seeded!"
