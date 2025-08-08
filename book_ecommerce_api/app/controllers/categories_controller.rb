class CategoriesController < ApplicationController
  before_action :authenticate_user!, except: %i[index show get_nested_category] # ✅ Kiểm tra token trước mọi action
  before_action :set_category, only: %i[show update destroy] 

  #Get flat category list, for admin
  def index
    authorize Category # authorize the class
    categories =
      Category
        .includes(:books)
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)
    render json: {
             status: {
               code: 200,
               message: 'Fetched categories successfully',
             },
             categories: categories,
             meta: {
               current_page: categories.current_page,
               next_page: categories.next_page,
               prev_page: categories.prev_page,
               total_pages: categories.total_pages,
               total_count: categories.total_count,
             },
           },
           status: :ok
  end

  #Get nested category list, for client
  def get_nested_category
    categories = Category.all()
    render json: {
             status: {
               code: 200,
               message: 'Fetched categories successfully',
             },
             categories: CategoryTreeSerializer.new(categories).as_json,
           }, status: :ok
  end

  def show
    authorize @category

    render json: {
             status: {
               code: 200,
               message: 'Fetched categories successfully',
             },
             category: @category,
           },
           status: :ok
  end

  def create
    category = Category.new(category_params)
    authorize category
    if category.save
      render json: {
               status: {
                 code: 201,
                 message: 'Category created successfully',
               },
               category: category,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Category creation failed',
               },
               errors: category.errors,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @category

    if @category.update(category_params)
      render json: {
               status: {
                 code: 200,
                 message: 'Category updated successfully',
               },
               category: @category,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Category update failed',
               },
               errors: @category.errors,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @category
    if @category.destroy
      render json: {
               status: {
                 code: 200,
                 message:
                   "Category '#{@category.name}' and its subcategories have been deleted.",
               },
               category: @category,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: "Failed to delete category '#{@category.name}'.",
                 errors: @category.errors.full_messages,
               },
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name, :description, :parent_id, :active)
  end
end
