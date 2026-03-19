class JournalEntriesController < ApplicationController
  before_action :set_journal_entry, only: %i[show edit update destroy]

  def index
    @journal_entries = current_user.journal_entries.order(recorded_at: :desc)
  end

  def show
  end

  def new
    @journal_entry = current_user.journal_entries.new(recorded_at: Time.zone.now, mood: "neutral")
  end

  def edit
  end

  def create
    @journal_entry = current_user.journal_entries.new(journal_entry_params)

    if @journal_entry.save
      redirect_to @journal_entry, notice: "Entree du journal creee."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @journal_entry.update(journal_entry_params)
      redirect_to @journal_entry, notice: "Entree du journal mise a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @journal_entry.destroy
    redirect_to journal_entries_path, notice: "Entree du journal supprimee."
  end

  private

  def set_journal_entry
    @journal_entry = current_user.journal_entries.find(params[:id])
  end

  def journal_entry_params
    params.require(:journal_entry).permit(:recorded_at, :symptoms, :activity_minutes, :mood, :notes)
  end
end
