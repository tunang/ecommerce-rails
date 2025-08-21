class BooksController < ApplicationController
  before_action :authenticate_user!,
                except: %i[index show get_books_by_category] # ✅ Kiểm tra token trước mọi action
  before_action :set_book, only: %i[show update destroy]

  def index
    authorize Book
    books =
      Book
        .includes(
          :authors,
          :categories,
          cover_image_attachment: :blob,
          sample_pages_attachments: :blob,
        )
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    render json: {
             status: {
               code: 200,
               message: 'Books loaded successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             meta: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end

  def search
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    # binding.pry
    # search_result = Book.search(params[:q], page: page, per_page: per_page)
    search_result = Book.search(params[:search])

    books =
      search_result
        .records
        .includes(
          :authors,
          :categories,
          cover_image_attachment: :blob,
          sample_pages_attachments: :blob,
        )
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    render json: {
             status: {
               code: 200,
               message: 'Books search successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             meta: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end

  def get_books_by_category
    category = Category.find(params[:category_id] || params[:id])
    books =
      category
        .books
        .includes(
          :authors,
          :categories,
          cover_image_attachment: :blob,
          sample_pages_attachments: :blob,
        )
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    render json: {
             status: {
               code: 200,
               message: 'Books by category loaded successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             meta: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @book
    render json: {
             status: {
               code: 200,
               message: 'Book loaded successfully',
             },
             book: BookSerializer.new(@book).as_json,
           },
           status: :ok
  end
  def create
    Book.transaction do
      @book = Book.new(book_params)

      unless @book.save
        render json: {
                 status: {
                   code: 422,
                   message: 'Book creation failed',
                 },
                 errors: @book.errors.full_messages,
               },
               status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end

      begin
        #Without sidekiq
        # stripe_data = StripeService.create_product_with_price(@book)
        # @book.update!(
        #   stripe_product_id: stripe_data[:product].id,
        #   stripe_price_id: stripe_data[:price].id,
        # )

        #Use sidekiq
        StripeSyncBookJob.perform_async(@book.id)
      rescue StripeService::StripeError => e
        render json: {
                 status: {
                   code: 422,
                   message: 'Book saved but Stripe upload failed',
                 },
                 errors: [e.message],
               },
               status: :unprocessable_entity
        raise ActiveRecord::Rollback #If failed, rollback
      end

      # Nếu đến đây nghĩa là thành công hết
      render json: {
               status: {
                 code: 201,
                 message: 'Book created successfully',
               },
               data: @book,
             },
             status: :created
    end
  end

  # if book.save
  #   render json: {
  #            status: {
  #              code: 201,
  #              message: 'Book created successfully',
  #            },
  #            book: BookSerializer.new(book).as_json,
  #          },
  #          status: :created
  # else
  #   render json: {
  #            status: {
  #              code: 422,
  #              message: 'Book creation failed',
  #            },
  #            errors: book.errors.full_messages,
  #          },
  #          status: :unprocessable_entity
  # end

  def update
    authorize @book
    if params[:book][:cover_image]
      @book.cover_image.attach(params[:book][:cover_image])
    end
    if params[:book][:sample_pages]
      @book.sample_pages.attach(params[:book][:sample_pages])
    end
    if @book.update(book_params)
      render json: {
               status: {
                 code: 200,
                 message: 'Book updated successfully',
               },
               book: BookSerializer.new(@book).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Book update failed',
               },
               errors: @book.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @book
    if @book.destroy
      render json: {
               status: {
                 code: 200,
                 message: "Book '#{@book.title}' has been deleted.",
               },
               book: BookSerializer.new(@book).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Failed to delete book.',
               },
               errors: @book.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end
  def book_params
    params
      .require(:book)
      .permit(
        :title,
        :description,
        :price,
        :stock_quantity,
        :featured,
        :active,
        :sold_count,
        :cost_price,
        :discount_percentage,
        :cover_image,
        sample_pages: [],
        author_ids: [],
        category_ids: [],
      )
  end
end
