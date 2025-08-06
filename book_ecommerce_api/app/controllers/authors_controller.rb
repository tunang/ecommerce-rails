class AuthorsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show] # ✅ Kiểm tra token trước mọi action
  before_action :set_author, only: %i[show update destroy]

  def index
    authorize Author

    authors = Author
                .includes(photo_attachment: :blob) 
                .page(params[:page] || 1)
                .per(params[:per_page] || 10)

    render json: {
      status: {
        code: 200,
        message: 'Fetched authors successfully'
      },
      authors: authors.map { |a| AuthorSerializer.new(a).as_json },
      pagination: {
        current_page: authors.current_page,
        next_page: authors.next_page,
        prev_page: authors.prev_page,
        total_pages: authors.total_pages,
        total_count: authors.total_count
      },
    }, status: :ok
  end


  def show
    authorize @author
    render json: {
             status: {
               code: 200,
               message: 'Fetched author successfully',
             },
             author: AuthorSerializer.new(@author).as_json,
           },
           status: :ok
  end

  def create
    author = Author.new(author_params.except(:image))
    authorize author
    author.photo.attach(params[:author][:photo]) if params[:author][:photo]
    if author.save
      render json: {
               status: {
                 code: 201,
                 message: 'Author created successfully',
               },
               author: AuthorSerializer.new(author).as_json,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Author creation failed',
               },
               errors: author.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @author
    @author.photo.attach(params[:author][:photo]) if params[:author][:photo]
    if @author.update(author_params)
      render json: {
               status: {
                 code: 200,
                 message: 'Author updated successfully',
               },
               author: @author
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Author update failed',
               },
               errors: @author.errors,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @author
    if @author.destroy
      render json: {
               status: {
                 code: 200,
                 message: "Author '#{@author.name}' has been deleted.",
               },
               author: @author
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: "Failed to delete Author '#{@author.name}'.",
                 errors: @author.errors.full_messages,
               },
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_author
    @author = Author.find(params[:id])
  end

  def author_params
    params
      .require(:author)
      .permit(:name, :biography, :nationality, :birth_date, :photo)
  end
end
