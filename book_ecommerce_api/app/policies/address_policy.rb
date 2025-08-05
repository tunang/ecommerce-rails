class AddressPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    record.user == user
  end

  def create?
    user.present?
  end

  def update?
    record.user == user
  end

  def destroy?
    record.user == user
  end
end
