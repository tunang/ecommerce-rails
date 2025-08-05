class CategoriesController < ApplicationController
  before_action :set_category, only: %i[show update destroy]

  def index
    authorize Category # authorize the class
    categories = Category.all
    render json: {
             status: {
               code: 200,
               message: 'Fetched categories successfully',
             },
             data: categories,
           },
           status: :ok
  end

  def show
    authorize @category
    render json: category
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
               data: category,
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
               data: @category,
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
