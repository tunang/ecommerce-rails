# Base image Ruby
FROM ruby:3.2.2

# Cài dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  git \
  curl

# Thư mục làm việc
WORKDIR /app

# Copy Gemfile trước để cache bundle install
COPY Gemfile Gemfile.lock ./

# Cài gems
RUN bundle install

# Copy toàn bộ source code
COPY . .

# Expose cổng Rails API
EXPOSE 3000

# Default command
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
