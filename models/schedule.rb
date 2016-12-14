class Schedule
  include DataMapper::Resource

  property :id, Serial
  property :current, Boolean, required: true, default: false
  property :name, String#, required: true
  property :year, Integer#, required: true
  property :show_santa_on, DateTime#, required: false
  property :end_pairing_on, DateTime#, required: false
  # property :activity_3_date, DateTime#, required: true

  # alias :show_santa_on :activity_1_date
  # alias :end_pairing_on :activity_2_date

  def pairing_ended?
    end_pairing_on.nil? ? false : (end_pairing_on < DateTime.now)
  end

  def still_pairing?
    end_pairing_on.nil? ? true : (end_pairing_on > DateTime.now)
  end

  def show_santa?
    show_santa_on.nil? ? false : (show_santa_on < DateTime.now)
  end
end


# Secret Santa, 2016, 23/12/2016, 10/12/2016

# property :id, Serial
# property :santa, String
# property :santee, String, required: true
# belongs_to :santee, 'User', key: true
# belongs_to :santa, 'User', key: true

# Schedule.new.current= true
# Schedule
