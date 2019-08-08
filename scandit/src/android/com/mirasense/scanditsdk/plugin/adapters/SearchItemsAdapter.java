package com.mirasense.scanditsdk.plugin.adapters;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import com.mirasense.scanditsdk.plugin.models.KeyPairBoolData;

import java.util.ArrayList;

public class SearchItemsAdapter extends RecyclerView.Adapter<SearchItemsAdapter.SearchViewHolder > implements Filterable {

  ArrayList<KeyPairBoolData> arrayList;
  ArrayList<KeyPairBoolData> mOriginalValues;
  LayoutInflater inflater;
  Resources resources;
  String package_name;
  Context context;
  int layoutItemList;
  private int selected = 0;

  public SearchItemsAdapter(Context context, ArrayList<KeyPairBoolData> arrayList, Resources resources, String package_name, int layoutItemList) {
    this.context = context;
    this.arrayList = arrayList;
    this.mOriginalValues = arrayList;
    inflater = LayoutInflater.from(context);
    this.resources = resources;
    this.package_name = package_name;
    this.layoutItemList = layoutItemList;
  }

  @Override
  public SearchItemsAdapter.SearchViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    View v = LayoutInflater.from(parent.getContext()).inflate(this.layoutItemList, parent, false);
    SearchItemsAdapter.SearchViewHolder pvh = new SearchItemsAdapter.SearchViewHolder(v);
    return pvh;
  }

  @Override
  public void onBindViewHolder(SearchItemsAdapter.SearchViewHolder  holder, int position) {
    final KeyPairBoolData data = arrayList.get(position);

    holder.textView.setText(data.getName());
    holder.textView.setTypeface(null, Typeface.NORMAL);
    holder.checkBox.setChecked(data.isSelected());

    holder.itemView.setOnClickListener(view -> {
      if (data.isSelected()) {
        selected--;
      } else {
        selected++;
      }

      data.setSelected(!data.isSelected());
      notifyDataSetChanged();
    });
  }

  @Override
  public long getItemId(int position) {
    return position;
  }

  @Override
  public int getItemCount() {
    return arrayList.size();
  }

  public ArrayList<KeyPairBoolData> getAllItems() {
    return arrayList;
  }

  public ArrayList<KeyPairBoolData> getSelectedItems() {
    ArrayList<KeyPairBoolData> selectedItems = new ArrayList<>();
    for (KeyPairBoolData item : arrayList) {
      if (item.isSelected()) {
        selectedItems.add(item);
      }
    }
    return selectedItems;
  }

  public ArrayList<Long> getSelectedIds() {
    ArrayList<Long> selectedItemsIds = new ArrayList<>();
    for (KeyPairBoolData item : arrayList) {
      if (item.isSelected()) {
        selectedItemsIds.add(item.getId());
      }
    }
    return selectedItemsIds;
  }

  @Override
  public Filter getFilter() {
    return new Filter() {

      @SuppressWarnings("unchecked")
      @Override
      protected void publishResults(CharSequence constraint, FilterResults results) {

        arrayList = (ArrayList<KeyPairBoolData>) results.values;
        notifyDataSetChanged();
      }

      @Override
      protected FilterResults performFiltering(CharSequence constraint) {
        FilterResults results = new FilterResults();
        ArrayList<KeyPairBoolData> FilteredArrList = new ArrayList<>();

        if (constraint == null || constraint.length() == 0) {

          results.count = mOriginalValues.size();
          results.values = mOriginalValues;
        } else {
          constraint = constraint.toString().toLowerCase();
          for (int i = 0; i < mOriginalValues.size(); i++) {
            String data = mOriginalValues.get(i).getName();
            if (data.toLowerCase().contains(constraint.toString())) {
              FilteredArrList.add(mOriginalValues.get(i));
            }
          }

          results.count = FilteredArrList.size();
          results.values = FilteredArrList;
        }
        return results;
      }
    };
  }

  public class SearchViewHolder extends RecyclerView.ViewHolder {
    TextView textView;
    CheckBox checkBox;
    View itemView;

    public SearchViewHolder (View itemView) {
      super(itemView);
      this.itemView = itemView;
      this.textView = itemView.findViewById(resources.getIdentifier("tvItemSpinnerSearch", "id", package_name));
      this.checkBox = itemView.findViewById(resources.getIdentifier("cbItemSpinnerSearch", "id", package_name));
    }
  }
}
